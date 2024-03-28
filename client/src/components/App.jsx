import icon from '../assets/icons/butterfly-icon.png';

function App() {
  return (
    <div className='sign-up-container flex-column'>
      <div className='icon-header-container flex-column'>
        <img className='butterfly-icon' src={icon} />
        <h1 className='header'>Social Butterfly</h1>
        <p>Linking Lives, Sharing Stories!</p>
        <a className='new-acc-link' href='/'>Create a new account</a>
        <a className='new-acc-link' href='/'>Sign in</a>
      </div>
      <footer className='flex-row'>
        Designed and developed by <a href='https://victoriakapelush.com' target='_blank'>Victoria Kapelush</a>
      </footer>
    </div>
  )
}

export default App
