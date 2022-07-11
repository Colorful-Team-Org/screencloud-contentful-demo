import { gql } from 'graphql-request';

export const QueryTypeFieldsGql = gql`
  {
    __schema {
      queryType {
        fields {
          name
        }
      }
    }
  }
`;
