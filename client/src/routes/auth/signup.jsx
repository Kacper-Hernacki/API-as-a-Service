import { useEffect, useRef } from "react";


function SignUp(){

  return(
    <div className="relative flex flex-col justify-center h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-purple-700">Sign Up</h1>
        <form className="space-y-4">
          <div>
            <label className="label"><span className="text-base label-text">Name</span></label>
            <input type="text" placeholder="Name" className="w-full input input-bordered input-primary" />
          </div>
          <div>
            <label className="label"><span className="text-base label-text">Email</span></label>
            <input type="text" placeholder="Email Address" className="w-full input input-bordered input-primary" />
          </div>
          <div>
            <label className="label"><span className="text-base label-text">Password</span></label>
            <input type="password" placeholder="Enter Password" className="w-full input input-bordered input-primary" />
          </div>
          <div>
            <label className="label"><span className="text-base label-text">Confirm Password</span></label>
            <input type="password" placeholder="Confirm Password" className="w-full input input-bordered input-primary" />
          </div>
          <button className="btn btn-block btn-primary">Sign Up</button>
          <span>Already have an account ? <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">Login</a></span>
        </form>
      </div>
    </div>
  )
}

export default SignUp;