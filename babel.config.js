module.exports = api => {
  return {
    plugins: ["@babel/plugin-proposal-class-properties"],
    presets: [
      [
        "@babel/preset-env",
        {
          // useBuiltIns: "entry",
          targets: api.caller(caller => caller && caller.target === "node")
            ? { node: "current" }
            : { chrome: "56", ie: "11" }
        }
      ]
    ]
  }
}