import express from 'express';
import addContextToRequest from '../middlewares/addContextToRequest.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import lti from './lti.js';
import status from './status.js';
import job from './job.js';

const { Router } = express;

export default async ({ pubSubConnection }) => {
    const router = Router();
    const apiRouter = Router();

    apiRouter.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(
            swaggerJSDoc({
                swaggerDefinition: {
                    basePath: '/lti',
                },
                apis: ['./src/routes/**/*.js'],
            })
        )
    );

    /**
     * @swagger
     *
     *  /:
     *      get:
     *          description: home
     *          produces:
     *              - application/json
     *          responses:
     *              200:
     *                  description: Home
     */
    apiRouter.get('/', (req, res) => {
        res.json({
            message: 'Welcome to the EdLib Lti API',
        });
    });

    apiRouter.use(await lti());
    apiRouter.use(await status());
    apiRouter.use(await job());

    router.get('/resources/_ah/health', (req, res) => {
        const probe = req.query.probe;

        if (probe === 'liveness') {
            res.send('ok');
        } else if (probe === 'readiness') {
            res.send('ok');
        } else {
            res.status(503).send();
        }
    });

    router.use('/lti', addContextToRequest({ pubSubConnection }), apiRouter);

    return router;
};
