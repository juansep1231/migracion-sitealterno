export type F5ProduNetDTOModel = {
    kind: string,
    name: string,
    partition: string,
    fullpath: string,
    generation: number,
    selflink: string,
    address: string,
    connectionLimit: number,
    description: string,
    dynamicRatio: number,
    ephemeral: string,
    fqdn: { 
        autopopulate: string; 
        
      };
    inheritProfile: string,
    logging: string,
    monitor: string,
    priorityGroup: number,
    rateLimit: string,
    ratio: number,
    session: string,
    state: string
  }
   


export type F5PoolMembersModel = {
    kind: string,
    selfLink:string,
    items:F5ProduNetDTOModel[]
};
export type GetPoolMembersDTOModel = {
  poolName: string,
  user: string,
  password: string,
}
export type ErrorResponse = {
    statusCode: number;
    errorMessage: string;
}


