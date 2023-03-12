import Navbar from "./Navbar";
const Home = (props) => {
  return (
    <div>
      <Navbar
        Loginval={props.Loginval}
        Loginfunc={props.Loginfunc}
        userData={props.userData}
        setUserData={props.setUserData}
      />
      <br /><br /><br /><br /><br />

      <h1>Welcome to Greddiit!</h1>
    </div>
  );
};

export default Home;
