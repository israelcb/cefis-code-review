"use client"

import { useState } from "react";
import Card from "antd/es/card/Card";
import Search from "antd/es/input/Search";
import { Content } from "antd/es/layout/layout";
import { Alert, Breadcrumb, List } from "antd";
import { Typography } from 'antd';
import Link from "next/link";
import DateLabel from "./components/DateLabel";

export default function Home() {
    const [userRepos, setUserRepos] = useState([])
    const [userSearch, setUserSearch] = useState('')
    const [accountName, setAccountName] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [emptySearch, setEmptySearch] = useState(false)
    const [accountNotFound, setAccountNotFound] = useState(false)

    const searchUserRepos = async search => {
        if (search.trim() === '') {
            setEmptySearch(true)
            return
        }
    
        setIsSearching(true)
        setAccountNotFound(false)
    
        const response = await fetch(`/api/github/repos/${search}`)
        const repos = (await response.json()).data
    
        if (repos === undefined) {
            setAccountNotFound(true)
            setIsSearching(false)
            setUserSearch('')
            return
        }
    
        setAccountName(search)
        setUserRepos(repos)
        setIsSearching(false)
    }
    
    const onUserSearchChange = e => {
        setEmptySearch(false)
        setUserRepos([])

        setUserSearch(e.target.value)
    }

    return (
        <Content>
            <Breadcrumb
                style={{ margin: '16px 0' }}
                items={[
                    { title: <Link href="/">Início</Link> },
                    { title: 'Selecionar Repositório' },
                ]}
            />

            <Card title="Informe o nome de usuário no Github">
                <Search
                    placeholder="Informe o nome de usuário Github de uma pessoa ou organização"
                    enterButton="Pesquisar"
                    size="large"

                    autoFocus={true}
                    disabled={isSearching}
                    loading={isSearching && userRepos.length === 0}
                    onSearch={searchUserRepos}

                    onChange={onUserSearchChange}
                    status={emptySearch && 'error'}

                    value={userSearch}
                />

                {accountNotFound &&
                    <Alert
                        type="error"
                        showIcon

                        message="Conta inexistente!"
                        description={
                            'Não existe nenhuma conta GitHub com este nome de usuário.'
                            + ' Por favor, revise as informações digitadas e tente novamente...'
                        }

                        style={{ marginTop: '10px' }}
                    />}
            </Card>

            {userRepos.length > 0 &&
            <Card
                title="Selecione um dos repositórios abaixo"
                style={{ margin: '15px 0 30px 0' }}
            >
                <List
                    grid={{
                        gutter: 16,
                        column: 6,
                    }}
                    dataSource={userRepos}
                    renderItem={rep => (
                        <List.Item>
                            <Card
                                title={<Link href={`/pr-review/user/${accountName}/repo/${rep.name}`}>{rep.full_name}</Link>}
                                extra={<Typography.Text type="secondary">{rep.language || '*/*'}</Typography.Text>}
                                style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)' }}
                            >
                                {!!rep.description ?
                                    <div style={{
                                        width: 'auto',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {rep.description || 'Sem descrição'}
                                    </div>
                                :
                                <Typography.Text
                                    type="secondary"
                                    style={{ height: '22px', display: 'block' }}
                                >
                                    Nenhuma descrição disponível
                                </Typography.Text>}

                                <br />
                                <DateLabel date={rep.created_at}/>
                            </Card>
                        </List.Item>
                    )}
                />
            </Card>}
        </Content>
    )
}