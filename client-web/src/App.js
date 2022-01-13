import logo from './link3_logo.svg';
import nearLogo from './near_logo.svg';

function App() {
  return (
    <div className="bg-gray-800 text-center items-center min-h-screen w-full flex flex-col justify-center text-white space-y-4">
      <header className="space-y-4">
        <img src={logo} className='h-80 mx-auto rounded-full' />
        <h1 class="text-6xl">Welcome to Link3</h1>
        <p class="text-md">
          a linktree alternative built on <a className="underline" href="https://near.org" target="_blank">NEAR</a>.
        </p>
      </header>

      <section className='space-y-8'>
        <button class="flex items-center space-x-1 bg-pink-500 ease-in-out transform duration-700 hover:bg-pink-300 px-8 py-2 rounded-lg font-bold">
          Login with NEAR
          <img src={nearLogo} className="h-6" alt="logo" />
        </button>
        <p class="text-xs">by <a
          className="text-sm underline font-bold"
          href="https://twitter.com/joaquimley"
          target="_blank"
          rel="noopener noreferrer"
        >
          @JoaquimLey
        </a>
        </p>
      </section>
    </div>
  );
}

export default App;
