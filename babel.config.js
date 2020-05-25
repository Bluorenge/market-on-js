module.exports = function (api) {
  api.cache(true)

  const presets = [
    [
      `@babel/preset-env`,
      {
        modules: false,
      },
    ],
  ]
  const plugins = [
    `@babel/plugin-proposal-class-properties`,
    `@babel/proposal-optional-chaining`,
    `@babel/proposal-nullish-coalescing-operator`,
    [
      `@babel/plugin-transform-runtime`,
      {
        corejs: 3,
      },
    ],
    [
      `@babel/plugin-transform-parameters`,
      {
        loose: true,
      },
    ],
  ]

  return {
    presets,
    plugins,
  }
}
