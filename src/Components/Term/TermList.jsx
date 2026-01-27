import React from 'react'

function TermList({ terms }) {
    if (!terms) {
        return <h1>Loading....</h1>
    }
    return (
        <div>
            <h1>Term List</h1>
            <Link to="/terms/new">Add Term</Link>

            {!terms.length ?
                <div>No terms Found</div>
                :
                <ul>
                    {
                        terms.map(
                            (oneTerm) => (
                                <li key={oneTerm.id}>
                                    <Link to={`/terms/${oneTerm.id}`}>{oneTerm.name}</Link>
                                </li>
                            )
                        )
                    }
                </ul>}
        </div>
    )
}

export default TermList
