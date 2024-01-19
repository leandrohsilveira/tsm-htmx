import ajvModule from 'ajv'
import fastifyPlugin from 'fastify-plugin'

const Ajv = ajvModule.default

export const ajv_engine_name = 'ajv_engine'

const ajv_engine = fastifyPlugin(
  async (fastify) => {
    const ajv = new Ajv({
      removeAdditional: 'all',
      useDefaults: true,
      coerceTypes: 'array',
    })
    fastify.setValidatorCompiler(({ schema }) => ajv.compile(schema))
  },
  { name: ajv_engine_name },
)

export default ajv_engine
