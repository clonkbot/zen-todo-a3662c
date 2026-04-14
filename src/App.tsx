import { useState, useRef, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('zen-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('zen-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue.trim(),
          completed: false,
          createdAt: Date.now(),
        },
      ]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#F7F5F0] flex flex-col">
      {/* Subtle paper texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <main className="flex-1 flex flex-col items-center px-4 py-8 md:py-16 relative z-10">
        {/* Header */}
        <header className="w-full max-w-md md:max-w-lg mb-8 md:mb-12 animate-fade-in">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#2D2A26] tracking-tight mb-2">
            Today
          </h1>
          <div className="h-px bg-[#2D2A26]/20 w-full" />
          {totalCount > 0 && (
            <p className="font-body text-sm text-[#2D2A26]/50 mt-3 tracking-wide">
              {completedCount} of {totalCount} complete
            </p>
          )}
        </header>

        {/* Input area */}
        <div
          className={`w-full max-w-md md:max-w-lg mb-8 transition-all duration-300 ${
            isInputFocused ? 'scale-[1.02]' : ''
          }`}
          style={{ animationDelay: '100ms' }}
        >
          <div className={`
            relative flex items-center gap-3 p-4 md:p-5
            bg-white/60 backdrop-blur-sm rounded-sm
            border border-[#2D2A26]/10
            transition-all duration-300
            ${isInputFocused ? 'shadow-lg border-[#C4633E]/40' : 'shadow-sm hover:shadow-md'}
          `}>
            <div className={`
              w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex-shrink-0
              transition-colors duration-300
              ${isInputFocused ? 'border-[#C4633E]' : 'border-[#2D2A26]/20'}
            `} />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="Add a new task..."
              className="
                flex-1 bg-transparent outline-none
                font-body text-base md:text-lg text-[#2D2A26]
                placeholder:text-[#2D2A26]/30 placeholder:italic
              "
            />
            <button
              onClick={addTodo}
              disabled={!inputValue.trim()}
              className={`
                p-2 md:p-3 rounded-sm transition-all duration-300 min-w-[44px] min-h-[44px]
                flex items-center justify-center
                ${inputValue.trim()
                  ? 'bg-[#C4633E] text-white hover:bg-[#A85232] active:scale-95'
                  : 'bg-[#2D2A26]/5 text-[#2D2A26]/20 cursor-not-allowed'}
              `}
              aria-label="Add task"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Todo list */}
        <div className="w-full max-w-md md:max-w-lg space-y-2 md:space-y-3">
          {todos.length === 0 ? (
            <div className="text-center py-16 md:py-20 animate-fade-in">
              <div className="font-display text-6xl md:text-7xl text-[#2D2A26]/10 mb-4">

              </div>
              <p className="font-body text-[#2D2A26]/40 italic text-sm md:text-base">
                A blank page awaits your intentions
              </p>
            </div>
          ) : (
            todos.map((todo, index) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                index={index}
              />
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 md:py-8 text-center relative z-10">
        <p className="font-body text-xs text-[#2D2A26]/30 tracking-wide">
          Requested by @PauliusX · Built by @clonkbot
        </p>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes strike {
          0% { width: 0; }
          100% { width: 100%; }
        }

        @keyframes unstrike {
          0% { width: 100%; }
          100% { width: 0; }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .strike-through::after {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          height: 2px;
          background: #C4633E;
          animation: strike 0.4s ease-out forwards;
        }

        .unstrike::after {
          animation: unstrike 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  index: number;
}

function TodoItem({ todo, onToggle, onDelete, index }: TodoItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(todo.id), 300);
  };

  return (
    <div
      className={`
        relative flex items-center gap-3 md:gap-4 p-4 md:p-5
        bg-white/40 backdrop-blur-sm rounded-sm
        border border-[#2D2A26]/5
        transition-all duration-300 ease-out
        hover:bg-white/60 hover:shadow-md
        ${isDeleting ? 'opacity-0 translate-x-4 scale-95' : 'opacity-100'}
      `}
      style={{
        animationDelay: `${index * 50}ms`,
        animation: 'fade-in 0.4s ease-out forwards',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`
          w-6 h-6 md:w-7 md:h-7 rounded-full border-2 flex-shrink-0
          flex items-center justify-center
          transition-all duration-300 min-w-[44px] min-h-[44px]
          ${todo.completed
            ? 'bg-[#C4633E] border-[#C4633E]'
            : 'border-[#2D2A26]/20 hover:border-[#C4633E]/60'}
        `}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {todo.completed && (
          <svg
            className="w-3 h-3 md:w-4 md:h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      {/* Task text with strike-through effect */}
      <span className={`
        flex-1 font-body text-base md:text-lg relative
        transition-colors duration-300
        ${todo.completed ? 'text-[#2D2A26]/40' : 'text-[#2D2A26]'}
      `}>
        <span className={`relative ${todo.completed ? 'strike-through' : ''}`}>
          {todo.text}
        </span>
      </span>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        className={`
          p-2 md:p-3 rounded-sm min-w-[44px] min-h-[44px]
          flex items-center justify-center
          transition-all duration-300
          ${isHovered || window.innerWidth < 768
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-2 pointer-events-none md:pointer-events-auto'}
          text-[#2D2A26]/30 hover:text-[#C4633E] hover:bg-[#C4633E]/10
          active:scale-95
        `}
        aria-label="Delete task"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default App;
