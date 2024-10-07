"use client"

import { Breadcrumb, Button, Col, notification, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import 'moment/locale/pt-br';
import PullRequestSelectionCard from '@/app/components/PullRequestSelectionCard';
import PullRequestDetailsCard from '@/app/components/PullRequestDetailsCard';
import { FileTreeCard } from '@/app/components/FileTreeCard';
import { CodeReviewCard } from '@/app/components/CodeReviewCard';

export default function PrReview() {
    const { user, repo } = useParams()
    const [pullRequests, setPullRequests] = useState([])
    const [selectedPR, setSelectedPR] = useState(null)
    const [pullRequestFileTree, setPullRequestFileTree] = useState(null)
    const [codeReview, setCodeReview] = useState(null)

    const [isCodeReviewLoading, setIsCodeReviewLoading] = useState(false)
    const [isPullRequestFilesLoading, setIsPullRequestFilesLoading] = useState(false)

    const [notificationApi, notificationContextHolder] = notification.useNotification()

    useEffect(() => {
        const searchPullRequests = async () => {
            const response = await fetch(`/api/github/list-prs/user/${user}/repo/${repo}`)
            const data = (await response.json()).data

            setPullRequests(data)
        }

        searchPullRequests();
    }, [user, repo])

    const searchPRFiles = async pr => {
        setIsPullRequestFilesLoading(true)

        const response = await fetch(`/api/github/list-pr-files/user/${user}/repo/${repo}/pr/${pr.number}`)
        const files = (await response.json()).data

        const treeFiles = files.map(f => ({
            ...f,
            key: f.sha,
            isLeaf: true,
        }))

        setPullRequestFileTree([{
            key: 0,
            title: repo,
            children: treeFiles,
        }])

        setIsPullRequestFilesLoading(false)
    }

    const performCodeReview = async pr => {
        setIsCodeReviewLoading(true)

        const response = await fetch(`/api/chatgpt/code-review/user/${user}/repo/${repo}/pr/${pr.number}`)
        const review = (await response.json()).data

        if (response.status !== 200) {
            notificationApi['error']({
                message: 'Algo deu errado...',
                description: 'Este pull request é muito extenso para ser analisado.',
            })

            restorePullRequestsList()
            return
        }

        setCodeReview(review)
        setIsCodeReviewLoading(false)
    }

    const selectPR = pr => {
        setSelectedPR(pr)
        searchPRFiles(pr)
        performCodeReview(pr)
    }

    const restorePullRequestsList = () => {
        setSelectedPR(null)
        setPullRequestFileTree(null)
        setCodeReview(null)

        setIsCodeReviewLoading(false)
        setIsPullRequestFilesLoading(false)
    }

    return (
        <Content>
            <Breadcrumb
                style={{ margin: '16px 0' }}
                items={[
                    { title: <Link href="/">Início</Link> },
                    { title: user },
                    { title: repo },
                    { title: 'Pull Requests' },
                ]}
            />

            {selectedPR === null ? (
                <PullRequestSelectionCard
                    pullRequests={pullRequests}
                    onPullRequestSelected={selectPR}
                />
            ) : (
                <>
                    <PullRequestDetailsCard
                        selectedPR={selectedPR}
                    />

                    <Row>
                        <Col span={6}>
                            <FileTreeCard
                                mainDir={`${user}/${repo}`}
                                fileTree={pullRequestFileTree}
                                loading={isPullRequestFilesLoading}
                            />
                        </Col>

                        <Col span={18}>
                            <CodeReviewCard
                                review={codeReview}
                                loading={isCodeReviewLoading}
                            />
                        </Col>
                    </Row>
                </>
            )}

            {pullRequestFileTree !== null &&
                <Button
                    type="primary"
                    style={{ marginRight: "10px", marginBottom: "10px" }}
                    onClick={restorePullRequestsList}
                >Voltar para a lista de Pull Requests</Button>
            }

            <Button
                danger
                href="/"
                type="primary"
                style={{ marginBottom: "10px" }}
            >Voltar para o início</Button>

            {notificationContextHolder}
        </Content>
    )
}