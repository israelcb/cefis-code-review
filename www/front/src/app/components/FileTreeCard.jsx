import { Card, Tree, Typography } from "antd"
import Link from "next/link"

export function FileTreeCard({ loading, fileTree, mainDir }) {
    const cardTitle = 'Arquivos modificados'
    const cardStyle = { margin: '15px 0 15px 0', height: '540px' }

    if (loading) {
        return (
            <Card
                loading={true}
                title={cardTitle}
                style={cardStyle}
            />
        )
    }

    return (
        <Card title={cardTitle} style={cardStyle}>
            <Tree.DirectoryTree
                multiple
                defaultExpandAll
                selectedKeys={[]}
                treeData={fileTree}
                style={{ height: '455px', overflowY: 'auto' }}
                titleRender={branch => {

                    if (!branch.isLeaf) {
                        return (
                            <Typography.Text key={branch.key} code>
                                {mainDir}
                            </Typography.Text>
                        )
                    }

                    let fileStyle = { fontWeight: 600 }

                    if (branch.status === 'added') {
                        fileStyle['color'] = '#007600'

                    } else if (branch.status === 'modified') {
                        fileStyle['color'] = '#ad8100'

                    } else {
                        fileStyle['color'] = '#bb0101'
                    }

                    return (
                        <Link
                            href={branch.blob_url}
                            target="_blank"
                            style={fileStyle}
                        >{branch.filename} (+{branch.additions},-{branch.deletions})</Link>
                    )
                }}
            />
        </Card>
    )
}