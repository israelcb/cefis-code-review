import { Avatar, Card, Row, Typography } from "antd";
import Markdown from "react-markdown";
import DateLabel from "./DateLabel";

export default function PullRequestDetailsCard({ selectedPR }) {
    return (
        <Card
            title={`Pull Request #${selectedPR.number} - ${selectedPR.title}`}
        >
            <Row>
                <Avatar
                    style={{ marginRight: '10px' }}
                    src={selectedPR.author.avatar}
                    size='large'
                />

                <div style={{ display: 'inline-block' }}>
                    <Typography.Text style={{ display: 'block' }}>{selectedPR.author.login}</Typography.Text>
                    <DateLabel date={selectedPR.created_at} />
                </div>
            </Row>

            {!!selectedPR.body ?
                <div
                    style={{ height: '400px', overflowY: 'auto', resize: 'vertical', maxHeight: 'fit-content' }}
                >
                    <Markdown>{selectedPR.body}</Markdown>
                </div>
                :
                <Typography.Text type="secondary">
                    Nenhuma descrição disponível
                </Typography.Text>
            }
        </Card>
    )
}