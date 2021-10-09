import { useEffect, useState } from 'react';

import {
    Divider, Typography, Avatar
} from '@material-ui/core';

import { ForumThread } from '../../../../apis/Entities/ForumThread';
import { ForumPost } from '../../../../apis/Entities/ForumPost';

import { getForumThreadByForumThreadId, getAllForumPostsOfAForumThread } from "../../../../apis/Forum/ForumApis";

import {
    ForumCardHeader, ForumCardContent, ForumCard, 
    ForumPostCard, ForumPostCardContent
} from "../ForumElements";

import ForumPostInputArea from './ForumPostInputArea';


function ForumPostList(props: any) {

    const [forumThread, setForumThread] = useState<ForumThread>();
    const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);

    useEffect(() => {
        var url = props.history.location.pathname;
        const forumThreadId = parseInt(url.split('/thread/')[1]);
        getForumThreadByForumThreadId(forumThreadId).then((res) => {
            setForumThread(res);
        }).catch((err) => {
            props.onCallSnackbar({ message: "Failure", type: "error" })
        });
        getAllForumPostsOfAForumThread(forumThreadId).then((res) => {
            setForumPosts(res);
        }).catch((err) => {
            props.onCallSnackbar({ message: "Failure", type: "error" })
        });

    }, [props]);

    const handleCallSnackbar = (snackbarObject: any) => {
        if (forumThread !== undefined)
        {
            getForumThreadByForumThreadId(forumThread.forumThreadId).then((res) => {
                setForumThread(res);
            }).catch((err) => {
                props.onCallSnackbar({ message: "Failure", type: "error" })
            });
            props.onCallSnackbar(snackbarObject);
        }
    }

    const formatDate = (date: Date) => {
        var d = new Date(date);
        return d.toDateString() + ', ' + d.toLocaleTimeString();
    }

    const mapPosts = (forumPosts: ForumPost[]) => {
        return (
            <div>
                {forumPosts.map(function (post, postId) {
                    return (
                        <>
                        { forumThread !== undefined &&
                            <ForumPostCard key={postId}>
                                <ForumPostCardContent>
                                    <Avatar alt="Remy Sharp" src={post.account.displayPictureUrl} />
                                    <Typography variant="body1" component="div" style={{ marginLeft: "20px" }}>
                                        <body style={{ color: "blue" }}>RE: {forumThread.name}</body>
                                        <br />
                                    Posted By {post.account.name} on {formatDate(post.timeStamp)}
                                    </Typography>
                                </ForumPostCardContent>
                                <Divider />
                                <ForumPostCardContent>
                                    <Typography variant="body1" component="div" style={{ marginLeft: "20px" }}>
                                        {post.message}
                                    </Typography>
                                </ForumPostCardContent>
                                <Divider />
                                <ForumPostInputArea forumThread={forumThread} onForumPostChange={handleCallSnackbar} />
                            </ForumPostCard>
                        }
                        </>
                    );
                })}
            </div>
        );
    }

    return (
        <ForumCard>
            {
                forumThread !== undefined &&
                < ForumCardHeader
                    title="Thread"
                />
            }

            <ForumCardContent>
                {
                    forumThread != undefined &&
                    <ForumPostCard id="post-card">
                        <ForumPostCardContent>
                            <Avatar alt="Remy Sharp" src={forumThread.account.displayPictureUrl} />
                            <Typography variant="body1" component="div" style={{ marginLeft: "20px" }}>
                                <body style={{ color: "blue" }}>{forumThread.name}</body>
                                <br />
                            Posted By {forumThread.account.name} on {formatDate(forumThread.timeStamp)}
                            </Typography>
                        </ForumPostCardContent>
                        <Divider />
                        <ForumPostCardContent>
                            <Typography variant="body1" component="div" style={{ marginLeft: "20px" }}>
                                {forumThread.description}
                            </Typography>
                        </ForumPostCardContent>
                        <Divider />
                        <ForumPostInputArea forumThread={forumThread} onForumPostChange={handleCallSnackbar} />
                    </ForumPostCard>
                }
            </ForumCardContent>

            <ForumCardContent>
                <body id="replies">
                    Replies
                </body>
            </ForumCardContent>

            <ForumCardContent>

                {forumThread != undefined && mapPosts(forumPosts)}
            </ForumCardContent>
        </ForumCard>
    );
}

export default ForumPostList