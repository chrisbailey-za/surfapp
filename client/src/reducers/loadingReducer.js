import { LOADING_FORECAST } from '../actions/types'

export default function(state = null, action) {
	switch(action.type) {
		case LOADING_FORECAST:
			return action.payload===false?true:false;
		default:
			return state;
	}	
}