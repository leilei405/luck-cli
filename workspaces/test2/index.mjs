import ora from "ora";

export default function () {
  const spinner = ora("Loading unicorns").start();

  setTimeout(() => {
    spinner.color = "yellow";
    spinner.text = "Loading rainbows";
    spinner.stop();
  }, 3000);
}
