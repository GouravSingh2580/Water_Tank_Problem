$(document).ready(function () {
  let input, height, width;
  $("input").on("change, keyup", function () {
    let currentInput = $(this).val();
    let userInput = currentInput.replace(/[A-Za-z!@#$%^&*. ()]/g, "");
    $(this).val(userInput);
  });

  $("button").click(function () {
    textInput = document.getElementById("inputValue").value;
    if (textInput) {
      input = textInput.split(",").map((el) => parseInt(el));
      height = Math.max(...input) + 1;
      width = input.length;

      const output = outputwater(input);
      waterTankProblem(input, "input", output);
      waterTankProblem(output, "output");
      document.getElementById("inputValue").value = "";
    }
  });

  function waterTankProblem(input, ID, output = []) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let eachCubicle = 200 / height;
    svg.setAttribute("height", `${400}px`);
    svg.setAttribute("width", `${400}px`);
    svg.setAttribute("viewBox", `0 0 200 200`);

    function yCoordinate() {
      let axis = 200 / height;
      for (let i = 0; i < height; i++) {
        const yline = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        yline.setAttribute("x1", "0");
        yline.setAttribute("y1", axis * i);
        yline.setAttribute("x2", "200");
        yline.setAttribute("y2", axis * i);
        yline.setAttribute("stroke", "black");
        svg.appendChild(yline);
      }
    }

    const xCoordinate = () => {
      let axis = 200 / width;
      for (let i = 0; i < width; i++) {
        const xline = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        xline.setAttribute("x1", axis * i);
        xline.setAttribute("y1", "0");
        xline.setAttribute("x2", axis * i);
        xline.setAttribute("y2", "200");
        xline.setAttribute("stroke", "black");
        svg.appendChild(xline);
      }
    };

    const p5 = (data, name) => {
      data.forEach((entry, index) => {
        const bar = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        bar.setAttribute("id", name + "rect");
        bar.setAttribute("x", index * (200 / data.length));
        bar.setAttribute("width", `${200 / data.length}px`);
        setTimeout(() => {
          bar.setAttribute("y", 200 - eachCubicle * entry);
          bar.setAttribute("height", `${entry * 100}px`);
        }, 100 * index);
        svg.appendChild(bar);
      });
    };
    document.getElementById(ID).innerHTML = "";
    document.getElementById(ID).appendChild(svg);

    let display =
      ID == "input" ? "[" + input + "]" : input.reduce((sum, a) => sum + a, 0);
    document.getElementById(ID + "array").innerHTML = display;

    p5(input, ID);
    if (output.length > 0) p5(output, "output");
    yCoordinate();
    xCoordinate();
  }

  const outputwater = (input) => {
    let tempElement = -1;
    let output = new Array(input.length).fill(0);
    for (let i = 0; i < input.length; i++) {
      if (tempElement >= 0) {
        if (input[i] > 0 && tempElement + 1 != i) {
          let tempBlock =
            input[tempElement] < input[i] ? input[tempElement] : input[i];
          output.fill(tempBlock, tempElement + 1, i);
          tempElement = input[i + 1] == 0 ? i : -1;
        }
      } else if (input[i] > 0 && input[i + 1] == 0) tempElement = i;
    }
    return output;
  };
});
