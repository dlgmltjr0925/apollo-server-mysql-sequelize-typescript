import { SCHEMAS_DIR, SCHEMAS_EXTENDS_DIR } from '../constants/path';

import fs from 'fs';
import { getGraphqlSchemas } from '../resolvers';
import { gql } from 'apollo-server';
import log from '../utils/log';

enum SCHEMA_TYPE {
  OBJECT = 'object',
  OBJECTIO = 'objectIO',
  ENUM = 'enum'
}

const schemas: any = {};

let typeDefs = '';

const addResolver = async () => {
  const types = ['Query', 'Mutation', 'Subscription'];
  types.map(type => {
    let typeDef = '';
    typeDef += `type ${type} {\n`;
    const fieldNames = Object.keys(schemas[type]);
    fieldNames.map(name => {
      typeDef += `  ${name}`;
      const argNames = Object.keys(schemas[type][name].args);
      if (argNames.length > 0) {
        let i;
        typeDef += `(`;
        for (i = 0; i < argNames.length - 1; i++) {
          typeDef += `${argNames[i]}: ${
            schemas[type][name].args[argNames[i]]
          }, `;
        }
        typeDef += `${argNames[i]}: ${schemas[type][name].args[argNames[i]]})`;
      }
      typeDef += `: ${schemas[type][name].returnType}\n`;
    });
    typeDef += '}\n\n';

    typeDefs += typeDef;

    if (!process.env.prd)
      fs.writeFile(`${SCHEMAS_DIR}/${type}.graphql`, typeDef, err => {
        if (err) console.error(err);
      });
  });
};

const addSchema = async () => {
  const types = ['Query', 'Mutation', 'Subscription'];
  let typeDef = '';
  Object.keys(schemas).map(type => {
    if (type in types) return;
    if (schemas[type].schemaType === 'Object') {
      typeDef += `${type.slice(-5) === 'Input' ? 'input' : 'type'} ${type} {\n`;
      const fieldNames = Object.keys(schemas[type]);
      fieldNames.map(name => {
        if (name === 'schemaType') return;
        typeDef += `  ${name}`;
        const argNames = Object.keys(schemas[type][name].args);
        if (argNames.length > 0) {
          let i;
          typeDef += `(`;
          for (i = 0; i < argNames.length - 1; i++) {
            typeDef += `${argNames[i]}: ${
              schemas[type][name].args[argNames[i]]
            }, `;
          }
          typeDef += `${argNames[i]}: ${
            schemas[type][name].args[argNames[i]]
          })`;
        }
        typeDef += `: ${schemas[type][name].returnType}\n`;
      });
      typeDef += '}\n';
    } else if (schemas[type].schemaType === 'ObjectIO') {
      for (let i = 0; i < 2; i++) {
        typeDef += `${i === 0 ? 'type' : 'input'} ${type}${
          i === 0 ? '' : 'Input'
        } {\n`;
        const fieldNames = Object.keys(schemas[type]);
        fieldNames.map(name => {
          if (name === 'schemaType') return;
          typeDef += `  ${name}`;
          const argNames = Object.keys(schemas[type][name].args);
          if (argNames.length > 0) {
            let i;
            typeDef += `(`;
            for (i = 0; i < argNames.length - 1; i++) {
              typeDef += `${argNames[i]}: ${
                schemas[type][name].args[argNames[i]]
              }, `;
            }
            typeDef += `${argNames[i]}: ${
              schemas[type][name].args[argNames[i]]
            })`;
          }
          typeDef += `: ${schemas[type][name].returnType}\n`;
        });
        typeDef += '}\n';
      }
    } else if (schemas[type].schemaType === 'Enum') {
      typeDef += `enum ${type} {\n`;
      schemas[type].values.map((value: string) => {
        typeDef += `  ${value}\n`;
      });
      typeDef += '}\n';
    }
  });

  typeDefs += typeDef;

  if (!process.env.prd)
    fs.writeFile(`${SCHEMAS_DIR}/Schemas.graphql`, typeDef, err => {
      if (err) console.error(err);
    });
};

export const getTypeDefs = async () => {
  if (typeDefs !== '') return typeDefs;

  const extendFiles = fs.readdirSync(SCHEMAS_EXTENDS_DIR);
  extendFiles.map(file => {
    const {
      fieldName,
      schemaType,
      subfield
    } = require(`${SCHEMAS_EXTENDS_DIR}/${file}`).default;
    if (!schemas[fieldName]) schemas[fieldName] = { schemaType };

    Object.keys(subfield).map(name => {
      if (typeof subfield[name] === 'string') {
        subfield[name] = {
          args: {},
          returnType: subfield[name]
        };
      }
    });
    schemas[fieldName] = { ...schemas[fieldName], ...subfield };
    if (schemaType === SCHEMA_TYPE.OBJECTIO) {
      schemas[fieldName + 'Input'] = {
        ...schemas[fieldName + 'Input'],
        ...subfield
      };
    }
  });

  const resolverSchema: any = await getGraphqlSchemas();
  const resolverTypes = Object.keys(resolverSchema);
  resolverTypes.map(type => {
    schemas[type] = { ...schemas[type], ...resolverSchema[type] };
  });

  // 타입 정의 (개발환경일 경우 확인을 위한 파일도 생성);
  typeDefs = 'scalar Date\n';

  // Query, Mutation, Subscription 정의
  await addResolver();

  // Schema 정의
  await addSchema();

  return gql`
    ${typeDefs}
  `;
};

export const getSchemas = () => schemas;

export default {
  getTypeDefs,
  getSchemas
};

/*
schemas = {
  Query: {
    user: {
      args: { user_id: 'Int!' },
      returnType: 'User',
    },
    users: {
      args: { where: 'UserInput' },
      returnType: '[User]',
    },
  },
  Mutation: {
    createUser: {
      args: { input: 'UserInput!' },
      returnType: 'User',
    },
    updateUser: {
      args: { input: 'UserInput', where: 'UserInput' },
      returnType: 'Int',
    },
    deleteUser: {
      args: { where: 'UserInput' },
      returnType: 'Int',
    }
  },
  Subscription: {
    subscribeUser: {
      args: {},
      returnType: '[User]',
    }
  },
  Root: {
    User: {                       // field name
      schemaType: 'Object',       // filed type : 'Object', 'ObjectIO', 'Enum',
      user_id: 'Int',             // subfiled info : key(column name), value(type)
      user_name: 'String',
      user_token: 'String',
      user_email: 'String',
      type: 'UserType',           // enum 
      create_at: 'Date',
      updated_at: 'Data',
    },
    UserType: {
      schemaType: 'Enum',
      values: ['ADMIN', 'USER'],
    }
  }
}
*/