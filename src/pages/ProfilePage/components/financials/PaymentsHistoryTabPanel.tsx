import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Toolbar } from "@material-ui/core";
import { useState } from "react";
import { useEffect } from "react";
import { GroupedByMonthsTransaction, Transaction } from "../../../../entities/Transaction";
import { getAllPaymentsByAccountId } from "../../../../apis/TransactionApis";
import { colours } from "../../../../values/Colours";
import { BlankStateContainer } from "../../ProfileElements";

function PaymentsHistoryTabPanel(props: any) {
    
    const [accountId, setAccountId] = useState<string>("");
    const [myPayments, setMyPayments] = useState<Transaction[]>([]);

    useEffect(() => {
        setAccountId(props.accountId)
    }, [props.accountId])

    useEffect(() => {
        if (accountId) {
            getAllPaymentsByAccountId(parseInt(accountId))
                .then(myPayments => setMyPayments([...myPayments]))
                .catch(error => console.log("Error retrieving my payments"))
        } 
    }, [accountId])


    const getRegroupedPayments = () => {
        let regrouped : GroupedByMonthsTransaction = {}  // dictionary of lists. key = month + year.
        
        myPayments.sort((a: Transaction, b: Transaction) => {
            // @ts-ignore
            const comp = new Date(b.dateTimeOfTransaction) - new Date(a.dateTimeOfTransaction);
            return comp;
        })

        myPayments.forEach((payment: Transaction) => {
            const month = new Date(payment.dateTimeOfTransaction).toLocaleString('default', { month: 'short' });
            const year = new Date(payment.dateTimeOfTransaction).getFullYear();
            const key = `${month} ${year}` // e.g. sept 2020

            if (!regrouped.hasOwnProperty(key)) {
               regrouped[key] = []
            }
            regrouped[key].push(payment);
        })

        return regrouped;
    }
    
    return (
        <>
            { myPayments && Object.keys(getRegroupedPayments()).map((monthyear: string) => (
                <Paper key={monthyear} style={{ margin: "1.5rem 0"}}>
                    <Toolbar variant="dense" disableGutters style={{ padding: "0 1rem", background: colours.GRAYHALF6, color: colours.GRAY3 }}>
                        { monthyear }
                    </Toolbar>
                    <TableContainer>
                        <Table>
                            {/*<TableHead>*/}
                            {/*    <TableRow>*/}
                            {/*        <TableCell><strong>Course Name</strong></TableCell>*/}
                            {/*        <TableCell align="right"><strong>Tutor Name</strong></TableCell>*/}
                            {/*        <TableCell align="right"><strong>Date</strong></TableCell>*/}
                            {/*        <TableCell align="right"><strong>Paid Via</strong></TableCell>*/}
                            {/*        <TableCell align="right"><strong>Price&nbsp;(SGD)</strong></TableCell>*/}
                            {/*    </TableRow>*/}
                            {/*</TableHead>*/}
                            <TableBody>
                                { getRegroupedPayments()[monthyear].map((payment: Transaction) => (
                                    <TableRow hover key={payment?.transactionId}>
                                        <TableCell component="th" scope="row" width="30%">
                                            {payment?.course.name}
                                        </TableCell>
                                        <TableCell align="right" width="20%">{payment?.payee.name}</TableCell>
                                        <TableCell align="right" width="30%">{new Date(payment?.dateTimeOfTransaction).toDateString()}</TableCell>
                                        <TableCell align="right" width="20%"><strong>-{payment?.coursePrice}</strong></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            ))}
            { myPayments.length === 0 && <BlankStateContainer><br/>Wow! No payments to be found. <br/> Time to start enrolling in some of our courses? 😉</BlankStateContainer>}
        </>
    )
}

export default PaymentsHistoryTabPanel;