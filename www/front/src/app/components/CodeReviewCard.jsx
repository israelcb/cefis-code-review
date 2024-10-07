import { Card, Carousel, Col, Divider, Row, Skeleton, Statistic, Typography } from "antd"
import CountUp from "react-countup"

const METRICS_LIST = {
    'funcionalidade': 'Funcionalidade',
    'legibilidade': 'Legibilidade',
    'clareza': 'Clareza',
    'complexidade': 'Complexidade',
    'manutenibilidade': 'Manutenibilidade',
    'escalabilidade': 'Escalabilidade',
    'reutilizacao': 'Reutilização',
    'consistencia': 'Consistência',
    'tamanho': 'Tamanho',
    'tratamento_erros': 'Tratamento de Erros',
}

export function CodeReviewCard({ loading, review }) {
    const cardTitle = 'Métricas'
    const cardStyle = {
        height: '540px',
        maxHeight: '540px',
        margin: '15px 0 15px 15px',
    }

    if (loading) {
        return (
            <Card
                loading={true}
                title={cardTitle}
                style={cardStyle}
            >
                <Skeleton paragraph={{ rows: 4 }} />
            </Card>
        )
    }

    return (
        <Card
            title={cardTitle}
            style={cardStyle}
        >
            <Row>
                <Col span={2}>
                    <div style={{
                        textAlign: 'center',
                        margin: '0 20px 12px 20px',
                    }}>
                        <Statistic
                            title={<h3 style={{ margin: '0px' }}>Nota Geral</h3>}
                            value={review.overall_score}
                            formatter={v => {
                                let style = { fontWeight: 'bolder' }

                                if (v < 3) style['color'] = '#cf0000'
                                else if (v < 6) style['color'] = '#eba011'
                                else style['color'] = '#008000'

                                return (
                                    <CountUp
                                        style={style}
                                        separator=","
                                        decimals={2}
                                        end={v}
                                    />
                                )
                            }}
                        />
                    </div>
                </Col>

                <Col span={22}>
                    <Typography.Text>
                        {review.overall_description}
                    </Typography.Text>
                </Col>
            </Row>

            <Divider>Métricas Por Critério</Divider>

            <Carousel
                autoplay
                slidesToShow={5}
                autoplaySpeed={5000}
            >
                {review.metrics.map(metric => {
                    const label = METRICS_LIST[metric.code]

                    return (
                        <div key={metric.code}>
                            <Card
                                title={label}
                                style={{
                                    margin: '0 10px',
                                    height: '235px',
                                }}
                            >
                                <Statistic
                                    value={metric.score}
                                    formatter={v => {
                                        let style = {
                                            fontWeight: 'bolder',
                                            fontSize: '.7em',
                                        }

                                        if (v < 3) style['color'] = '#cf0000'
                                        else if (v < 6) style['color'] = '#eba011'
                                        else style['color'] = '#008000'

                                        return (
                                            <CountUp
                                                style={style}
                                                separator=","
                                                decimals={2}
                                                end={v}
                                                suffix=" /10.00"
                                            />
                                        )
                                    }}
                                />
                                {metric.description}
                            </Card>
                        </div>
                    )
                })}
            </Carousel>
        </Card>
    )
}