import { useCounter } from "@/hooks/useCounter";

const HomePage = () => {
  const { count, increment, decrement, reset } = useCounter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">计数器</h1>
      <div className="text-6xl font-bold text-blue-600 mb-8">{count}</div>
      <div className="flex gap-3">
        <button
          onClick={decrement}
          className="px-5 py-2 text-lg font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
        >
          减少
        </button>
        <button
          onClick={reset}
          className="px-5 py-2 text-lg font-medium text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition-colors"
        >
          重置
        </button>
        <button
          onClick={increment}
          className="px-5 py-2 text-lg font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
        >
          增加
        </button>
      </div>
    </div>
  );
};

export default HomePage;
