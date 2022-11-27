import "../styles/styles.css";

let measure;

document.querySelector(".open-measure").addEventListener("click", (e) => {
  e.preventDefault();
  if (typeof measure == "undefined") {
    import("./Measure")
      .then((x) => {
        measure = new x.default();
        setTimeout(() => measure.openTheMeasure(), 20);
      })
      .catch(() => console.log("Jest jakiś problem"));
  } else {
    measure.openTheMeasure();
  }
});

if (module.hot) {
  module.hot.accept();
}
