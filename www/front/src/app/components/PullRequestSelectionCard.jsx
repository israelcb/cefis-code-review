import { Avatar, Card, List, Typography } from "antd";
import DateLabel from "./DateLabel";
import Link from "next/link";

export default function PullRequestSelectionCard({ pullRequests, onPullRequestSelected }) {

    return (
        <Card
            title="Selecione um Pull Request da lista abaixo"
            style={{ marginBottom: "15px" }}
        >
            <List
                grid={{ gutter: 12, column: 4 }}
                dataSource={pullRequests}
                renderItem={pr => (
                    <List.Item>
                        <Card
                            style={{
                                minHeight: 200,
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                            }}
                        >
                            <Card.Meta
                                avatar={
                                    <Avatar
                                        src={pr.author.avatar}
                                        style={{ marginTop: '8px' }}
                                    />
                                }
                                title={
                                    <>
                                        <Link
                                            href=""
                                            onClick={() => onPullRequestSelected(pr)}
                                        >
                                            {`#${pr.number} - ${pr.title}`}
                                        </Link>

                                        <DateLabel
                                            prefix={`${pr.author.login}, `}
                                            date={pr.created_at}
                                        />
                                    </>
                                }
                            />

                            <br />

                            {!!pr.body ?
                                <Typography.Paragraph ellipsis={{ rows: 3 }}>
                                    {pr.body}
                                </Typography.Paragraph>
                                :
                                <Typography.Text type="secondary">
                                    Nenhuma descrição disponível
                                </Typography.Text>
                            }
                        </Card>
                    </List.Item>
                )}
            />
        </Card>
    )
}