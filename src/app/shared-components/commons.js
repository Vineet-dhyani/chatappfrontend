import format from 'date-fns/format';
import DoneIcon from '@material-ui/icons/Done';
import { DoneAll, ScheduleOutlined, SmsFailedOutlined } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';

function getAccessToken() {
	const accessToken = window.localStorage.getItem('jwt_access_token');
	if (accessToken !== null) {
		return accessToken;
	}
	return window.sessionStorage.getItem('jwt_access_token');
}

export function isToday(someDate) {
	const today = new Date();
	return (
		someDate.getDate() === today.getDate() &&
		someDate.getMonth() === today.getMonth() &&
		someDate.getFullYear() === today.getFullYear()
	);
}

export function showDateTime(someDate, showTime) {
	const dateObj = new Date(someDate);
	if (isToday(dateObj)) {
		return format(dateObj, 'HH:mm');
	}
	return format(dateObj, `M/dd/yy${showTime ? ' HH:mm' : ''}`);
}

export function renderReadIcon(item) {
	if (item.send_status === 'failed') {
		return (
			<Tooltip title={item.message_vendor_verdict || 'Failed'}>
				<SmsFailedOutlined className="pl-5" style={{ color: 'red' }} />
			</Tooltip>
		);
	}
	switch (item.read_status) {
		case 'viewed':
			return <DoneAll className="pl-5" style={{ color: '#87CEEB' }} />;
		case 'delivered':
			return <DoneAll className="pl-5" />;
		case 'sent':
			return <DoneIcon className="pl-5" />;
		case 'triggered':
			return <ScheduleOutlined className="pl-5" />;
		default:
			return <></>;
	}
}

export default getAccessToken;
