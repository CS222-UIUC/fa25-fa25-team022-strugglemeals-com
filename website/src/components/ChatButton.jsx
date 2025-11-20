export default function ChatButton({ type, className, onClickHandler }) {
  return (
    <button
      type={type}
      className={className}
      onClick={onClickHandler}
    >
      ChefBot
    </button>
  );
}
