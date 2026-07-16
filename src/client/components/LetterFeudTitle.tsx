export function LetterFeudTitle() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Reddit+Sans:wght@800;900&display=swap"
        rel="stylesheet"
      />
      <h1
        style={{
          fontFamily: "'Reddit Sans', sans-serif",
          fontWeight: 900,
          fontStyle: 'italic',
          fontSize: '3rem',
          letterSpacing: '0.02em',
          color: '#fde047',
          WebkitTextStroke: '2px #6b21a8',
          textShadow: `
            2px 2px 0 #6b21a8,
            4px 4px 0 #4c1d6e,
            6px 6px 8px rgba(0,0,0,0.35)
          `,
          margin: 0,
        }}
      >
        LETTER FEUD
      </h1>
    </>
  );
}