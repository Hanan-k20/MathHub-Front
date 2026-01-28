import React from 'react'

function SolutionDetail() {
  return (
    <div>


            <div className="entry-content">
                                        <MathJax>{`\\(${sol.content}\\)`}</MathJax>
                                    </div>
           {user.username === sol.user?.username ? (
                                                <div className="mini-buttons">
                                                    <Link to={`/problems/${problemId}/solutions/${sol.id}/update`} className="edit-link">Edit</Link>
                                                    <button onClick={() => handleDeleteSolution(sol.id)} className="delete-link">Delete</button>
                                                </div>
                                            ) : (
                                                <p></p>
                                            )}
      
    </div>
  )
}

export default SolutionDetail
