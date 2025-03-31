// Auto exit/enter fullscreen mode
function ToggleFullscreen(element = document.documentElement) {
  if (document.fullscreenEnabled) {
    const fullscreenElement = document.fullscreenElement;

    (fullscreenElement ? document : element)
      [fullscreenElement ? "exitFullscreen" : "requestFullscreen"]()
      .then((_) => void 0)
      .catch((error) => {
        console.error(
          `Error ${fullscreenElement ? "exiting" : "entering"} fullscreen: `,
          error
        );
      });
  } else {
    console.error("Fullscreen not supported");
  }
}

// Factorial function
function factorial(n) {
  if (n < 0 || !Number.isInteger(n))
    throw Error("Factorial requires a non-negative integer");
  if (n === 0) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

// Helper function to check if currentInput is a valid number
function isValidNumber(str) {
  return !isNaN(parseFloat(str)) && isFinite(parseFloat(str));
}
