import "./App.css";

function App() {
  const handlerClickShare = () => {
    if (navigator.share) {
      try {
        const data = {
          title: "TEST Shate",
          text: "Hola Juan!\n\nVictor te quiero solicitar un pago de 23 DOC, puedes usar los siguientes enlaces:\n\nMetamask: https://metamask.app.link/dapp/https://testnet.bitchill.app\nGoogle Login: https://testnet.bitchill.app/payment\n\nGracias",
          url: "https://testnet.bitchill.app",
        };
        navigator.share(data);
      } catch (error) {
        console.log("error to share", error);
        alert("error to share", error);
      }
    } else {
      console.log("can not share");
      alert("can not share");
    }
  };

  return (
    <>
      <button onClick={handlerClickShare}>Share info</button>
    </>
  );
}

export default App;
