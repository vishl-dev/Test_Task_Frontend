import { gql } from "@apollo/client";

export const CREATE_TASK = gql`
mutation createTask($name: String!, $status: String!) {
  createTask(name: $name, status: $status) {
    task {
      id,
      name,
      status
    }
  }
}`;

export const UPDATE_TASK = gql`
mutation updateTask($id: ID! ,$name: String!, $status: String!) {
  updateTask(id: $id, name: $name, status: $status) {
    post {
      id,
      name,
      status
    }
  }
}`;

export const DELETE_TASK = gql`
mutation deleteTask($id: ID!) {
  deleteTask(id: $id) {
    task {
      id,
      name
    }
  }
}`;

export const GET_TASK = {
    method: 'POST',
    url: 'https://vishaldeveloperwork.pythonanywhere.com/graphql/',
    headers: {
      'content-type': 'application/json'
    },
    data: {
      query: `{
        tasks {
          id,
          name,
          status
        }
      }`
    }
  };

export const DELETE_BULK_TASK = gql`
  mutation bulkDelete($id: [ID!]!){
    bulkDelete(ids: $id) {
        success
      }
  }`;
