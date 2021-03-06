import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Observable, Subject, Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import * as GQL from '../../../../../shared/src/graphqlschema'
import { gql, queryGraphQL } from '../../../backend/graphql'
import { FilteredConnection } from '../../../components/FilteredConnection'
import { PageTitle } from '../../../components/PageTitle'
import { eventLogger } from '../../../tracking/eventLogger'
import { createAggregateError } from '../../../util/errors'
import { externalAccountFragment, ExternalAccountNode, ExternalAccountNodeProps } from './ExternalAccountNode'

interface Props extends RouteComponentProps<{}> {
    user: GQL.IUser
}

class FilteredExternalAccountConnection extends FilteredConnection<
    GQL.IExternalAccount,
    Pick<ExternalAccountNodeProps, 'onDidUpdate' | 'showUser'>
> {}

/**
 * Displays the external accounts (from authentication providers) associated with the user's account.
 */
export class UserAccountExternalAccountsPage extends React.Component<Props> {
    private subscriptions = new Subscription()
    private externalAccountUpdates = new Subject<void>()

    public componentDidMount(): void {
        eventLogger.logViewEvent('UserAccountExternalAccounts')
    }

    public componentWillUnmount(): void {
        this.subscriptions.unsubscribe()
    }

    public render(): JSX.Element | null {
        const nodeProps: Pick<ExternalAccountNodeProps, 'onDidUpdate' | 'showUser'> = {
            onDidUpdate: this.onDidUpdateExternalAccount,
            showUser: false,
        }

        return (
            <div className="user-settings-external-accounts-page">
                <PageTitle title="External accounts" />
                <h2>External accounts</h2>
                <FilteredExternalAccountConnection
                    className="list-group list-group-flush mt-3"
                    noun="external account"
                    pluralNoun="external accounts"
                    queryConnection={this.queryUserExternalAccounts}
                    nodeComponent={ExternalAccountNode}
                    nodeComponentProps={nodeProps}
                    updates={this.externalAccountUpdates}
                    hideSearch={true}
                    noSummaryIfAllNodesVisible={true}
                    history={this.props.history}
                    location={this.props.location}
                />
            </div>
        )
    }

    private queryUserExternalAccounts = (args: { first?: number }): Observable<GQL.IExternalAccountConnection> =>
        queryGraphQL(
            gql`
                query UserExternalAccounts($user: ID!, $first: Int) {
                    node(id: $user) {
                        ... on User {
                            externalAccounts(first: $first) {
                                nodes {
                                    ...ExternalAccountFields
                                }
                                totalCount
                                pageInfo {
                                    hasNextPage
                                }
                            }
                        }
                    }
                }
                ${externalAccountFragment}
            `,
            { user: this.props.user.id, first: args.first }
        ).pipe(
            map(({ data, errors }) => {
                if (!data || !data.node) {
                    throw createAggregateError(errors)
                }
                const user = data.node as GQL.IUser
                if (!user.externalAccounts) {
                    throw createAggregateError(errors)
                }
                return user.externalAccounts
            })
        )

    private onDidUpdateExternalAccount = () => this.externalAccountUpdates.next()
}
