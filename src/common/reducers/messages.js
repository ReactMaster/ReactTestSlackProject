import { ADD_MESSAGE, RECEIVE_MESSAGE, LOAD_MESSAGES, LOAD_MESSAGES_SUCCESS, LOAD_MESSAGES_FAIL, AUTH_SIGNOUT_SUCCESS, REMOVE_STICKER} from '../constants/ActionTypes';

const initialState = {
  loaded: false,
  data: [],
  fetchHistory: []
};
export default function messages(state = initialState, action) {
  switch (action.type) {
  case ADD_MESSAGE:
    return {...state,
      data: [...state.data, action.message]
    };

    case REMOVE_STICKER:
      return {...state,
        data: [...state.data.filter((messages) => {
          if(messages.channelID == action.message.channelID && messages.text.indexOf('sticker') !== -1) {
            messages.text = messages.text.replace('sticker', '');
          }
          return messages;
        }), action.message.text.replace('/sticker', '')]
      };

  case RECEIVE_MESSAGE:
    return {...state,
      data: [...state.data, action.message]
    };
  case LOAD_MESSAGES:
    return {...state,
      loading: true
    };
  case LOAD_MESSAGES_SUCCESS:
    return {...state,
      loading: false,
      loaded: true,
      fetchHistory: [...state.fetchHistory, { lastFetch: action.date, channelName: action.channel }],
      data: [...state.data.filter(message => message.channelID !== action.channel), ...action.json]
    };
  case LOAD_MESSAGES_FAIL:
    return {...state,
      loading: false,
      loaded: false,
      error: action.error,
      data: [...state.data]
    };
  case AUTH_SIGNOUT_SUCCESS:
    return {
      loaded: false,
      data: [],
      fetchHistory: []
    };
  default:
    return state;
  }
}
