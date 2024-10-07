import moment from 'moment';
import 'moment/locale/pt-br';
import { Typography } from "antd";

export default function DateLabel({ prefix, date }) {
    moment.locale('pt-br')
    date = moment(date)
    const formattedDate = date.format('DD [de] MMMM [de] YYYY, HH:mm')

    return (
        <Typography.Text
            type="secondary"
            style={{ display: 'block' }}
        >{prefix || ''}{formattedDate}</Typography.Text>
    )
}