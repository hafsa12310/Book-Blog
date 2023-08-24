import styles from './CommentList.module.css';
import Comment from '../Comment/comment';

function CommentList ({comments}) {

    return (
        <div className={StyleSheet.commentListWrapper}>
            <div className={styles.commentlist}>
            {comments.length === 0 ? 
            (<div className={styles.nocomments}>No comments posted</div>)
            :
            comments.map(comment => (
                <Comment key={comment._id} comment={comment} />
            ))
            
            }

        </div>
            
        </div>
    )


}

export default CommentList;