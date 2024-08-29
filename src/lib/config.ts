const CONFIG = {
  jsDocs: {
    apis: ['./routes-files/route.ts'],
    swagger: "2.0",
    swaggerDefinition: {
      info: {
        title: 'Some Service',
        version: '0.0.1',
        description: 'This is an API doc for Some Service.',
      },
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'Optional authorization header using the Bearer scheme.',
        },
      },
    },
  },
};

export default CONFIG;
