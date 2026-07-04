import "./loadingspinner.css";

export default function LoadingSpinner({
  size = 50,
  color = "#2563eb",
}) {
  return (
    <div className="spinner-container">
      <div
        className="spinner"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderTopColor: color,
        }}
      />
    </div>
  );
}