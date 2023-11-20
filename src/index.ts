import {resolve} from 'path';
import stream from './stream';
import {parser, reader} from './transformer';

type Variables<T> = Record<keyof T, string> | Record<string, never>;
type Options = {
    bufferSize: number,
    cwd: string,
};

/**
 *
 * @param options
 */
const factory = <T extends Variables<T>>(options: Partial<Options> = {}): Promise<Variables<T>> => {
    const {
        bufferSize = 1024 * 32,
        cwd = process.cwd(),
    } = options;

    const file = resolve(cwd, '.env');
    const variables = <Variables<T>>{};

    return new Promise((resolve): void => {
        /**
         *
         * @param variables
         */
        const update = (variables) => {
            return {
                ...variables,
                ...process.env,
            }
        }

        /**
         *
         * @param key
         * @param value
         */
        const onData = ([key, value]: [string, string]): void => {
            if (!process.env[key]) {
                process.env[key] = value;
                variables[key] = value;
            }
        };

        /**
         *
         */
        const onEnd = (): void => {
            resolve(update(variables));
        };

        /**
         *
         */
        const onError = (): void => {
            resolve(update(variables));
        };

        stream(file, bufferSize)
            .on('error', onError)
            .pipe(reader())
            .pipe(parser())
            .on('data', onData)
            .on('end', onEnd)
        ;
    });
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 25.01.2022
 * Time: 21:52
 */
export default factory;
