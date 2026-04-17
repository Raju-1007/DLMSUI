import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // goes to previous page
  };

  return (
    <button onClick={goBack} style={styles.button}>
      ←
    </button>
  );
};

const styles = {
  button: {
    fontSize: "20px",
    padding: "8px 12px",
    cursor: "pointer",
    border: "none",
    background: "#eee",
    borderRadius: "6px"
  }
};

export default BackButton;