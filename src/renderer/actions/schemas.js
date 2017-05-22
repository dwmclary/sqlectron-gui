import { getCurrentDBConn } from './connections';


export const FETCH_SCHEMAS_REQUEST = 'FETCH_SCHEMAS_REQUEST';
export const FETCH_SCHEMAS_SUCCESS = 'FETCH_SCHEMAS_SUCCESS';
export const FETCH_SCHEMAS_FAILURE = 'FETCH_SCHEMAS_FAILURE';
export const FETCH_SCHEMAS_BQ_SUCCESS = 'FETCH_SCHEMAS_BQ_SUCCESS';

export function fetchSchemasIfNeeded (database) {
  return (dispatch, getState) => {
    if (shouldFetchSchemas(getState(), database)) {
      dispatch(fetchSchemas(database));
    }
  };
}


function shouldFetchSchemas (state, database) {
  const schemas = state.schemas;
  if (!schemas) return true;
  if (schemas.isFetching) return false;
  if (!schemas.itemsByDatabase[database]) return true;
  return schemas.didInvalidate;
}

function fetchAdditionalBQSchemas(database) {
  console.log("fetching schemas for", database);
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_SCHEMAS_REQUEST, database });
    try {
      const dbConn = getCurrentDBConn(getState());
      const schemas = await dbConn.listSchemas();
      console.log("schemas are", schemas);
      dispatch({ type: FETCH_SCHEMAS_BQ_SUCCESS, database, schemas });
    } catch (error) {
      dispatch({ type: FETCH_SCHEMAS_FAILURE, error });
    }
  };
}


function fetchSchemas (database) {
  console.log("fetching schemas for", database);
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_SCHEMAS_REQUEST, database });
    try {
      const dbConn = getCurrentDBConn(getState());
      const schemas = await dbConn.listSchemas();
      console.log("schemas are", schemas);
      dispatch({ type: FETCH_SCHEMAS_SUCCESS, database, schemas });
    } catch (error) {
      dispatch({ type: FETCH_SCHEMAS_FAILURE, error });
    }
  };
}
