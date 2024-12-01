export function formatText(text: string): JSX.Element {
  const parts = text.split("**");
  const formattedText = parts.map((part, index) => {
    if (index % 2 === 0) return part;
    else return <strong key={index}>{part}</strong>;
  });

  return <>{formattedText}</>;
}
