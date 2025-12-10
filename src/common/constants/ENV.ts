import jetEnv, { num, str } from 'jet-env';
import { NodeEnvs } from '.';

/******************************************************************************
                                Setup
******************************************************************************/

const ENV = jetEnv({
  NodeEnv: (val: string) => {
    if (!Object.values(NodeEnvs).includes(val as NodeEnvs)) {
      throw new Error(`Invalid NodeEnv: ${val}. Must be one of: ${Object.values(NodeEnvs).join(', ')}`);
    }
    return val as NodeEnvs;
  },
  Port: num,
  Mongodb: str,
  Jwtsecret: str,
});

/******************************************************************************
                            Export default
******************************************************************************/

export default ENV;