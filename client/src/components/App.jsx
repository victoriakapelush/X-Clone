import { Link } from 'react-router-dom';
import icon from '../assets/icons/butterfly-icon.png';

function App() {
  return (
    <div className='sign-up-container flex-column'>
      <div className='icon-header-container flex-column'>
        <img className='butterfly-icon' src={icon} />
        <h1 className='header'>Social Butterfly</h1>
        <p>Linking Lives, Sharing Stories!</p>
        <Link className='new-acc-link' to='/signup'>Create a new account</Link>
        <Link className='new-acc-link' to='/'>Sign in</Link>
      </div>
      <footer className='flex-row'>
        Designed and developed by <a href='https://victoriakapelush.com' target='_blank'>Victoria Kapelush</a>
      </footer>
    </div>
  )
}

export default App
