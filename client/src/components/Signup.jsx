function Signup() {
    return (
      <div className="flex-row">
        <div className="flex-column">
            <h1>Create Account</h1>
            <p>We are so excited to have you join us!</p>
        </div>
        <div>
            <h2>Your account</h2>
            <form className="flex-column">
                <label>Username</label>
                <input></input>
                <label>Email</label>
                <input></input>
                <label>Password</label>
                <input></input>
            </form>
            <h2>Or</h2>
            <form>
                Google signin
            </form>
        </div>
      </div>
    )
  }
  
  export default Signup