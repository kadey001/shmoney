import React from 'react';
import '../styles/RootStyle.css'
import './Home.jsx';
import { Table, Accordion, Card, Alert, AccordionCollapse } from 'react-bootstrap';
import PieChart from './PieChart.js';
import { compose } from 'recompose';
import { withFirebase } from './firebase';
import { withAuthUserContext } from './session';

class DashboardBase extends React.Component {  
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
      groupMembers: null,
      groupName: null,
      isNotGroupMember: false,
      isGroupMember: false,
      isGroupOwner: false,
      groupId: null,
      ownerUid: null,
      currentBillId: null,
      bills: null,
      currentBill: null
	  };
  }
  componentDidMount() {
    const authUser = this.props.authUser;
    const groupState = this.props.groupState;
    //Ensures that if the groupState is delayed in being updated 
    //then it will be updated properly
    if(!groupState.groupName) {
      setTimeout(() => { //Start Timer
        const authUser = this.props.authUser;
        const groupState = this.props.groupState;
        const isGroupOwner = authUser.uid === groupState.ownerUid;
        
        this.updateCurrentBill(groupState.currentBillId, groupState.bills);

        this.setState({
          authUser,
          groupMembers: groupState.groupMembers,
          groupName: groupState.groupName,
          isNotGroupMember: groupState.isNotGroupMember,
          isGroupMember: groupState.isGroupMember,
          isGroupOwner,
          groupId: groupState.groupId,
          ownerUid: groupState.ownerUid,
          currentBillId: groupState.currentBillId,
          bills: groupState.bills
        });
      }, 700);
    } else {
      const isGroupOwner = authUser.uid === groupState.ownerUid;

      this.updateCurrentBill(groupState.currentBillId, groupState.bills);

      this.setState({
        authUser,
        groupMembers: groupState.groupMembers,
        groupName: groupState.groupName,
        isNotGroupMember: groupState.isNotGroupMember,
        isGroupMember: groupState.isGroupMember,
        isGroupOwner,
        groupId: groupState.groupId,
        ownerUid: groupState.ownerUid,
        currentBillId: groupState.currentBillId,
        bills: groupState.bills
      });
    }
  }
  updateCurrentBill = (currentBillId, bills) => {
    for(let item in bills) {
      if(bills[item].doc_id === currentBillId) {
        this.setState({currentBill: bills[item]});
      }
    }
  }
  render() {
    return (
        <div className = "main-grid" >
          <div className = "left-grid" >
              
              <BillCard
                onChangeCurrentBill={this.state.currentBill}
                onChangeAuthUser={this.state.authUser}
              />
              {this.state.currentBill && <Pie/>}
          </div>
          <div className = "right-grid">
            <h1> Your Group: {this.state.groupName && this.state.groupName}</h1>
            <MyAccord onChangeCurrentBill={this.state.currentBill}/>
          </div>

        </div>
    );
  };
};

const MyAccord = ({onChangeCurrentBill}) => {
  if(!onChangeCurrentBill) return <h3 className="center">No Bills Yet</h3>;

  return (
    <>
      <Accordion defaultActiveKey = "0">
        <Card text="dark" border="light">
            <Card.Header>
                <Accordion.Toggle as={Card.Header}  eventKey="0">
                    Group Info
                </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
                <Card.Body >
                    <MemberTable onChangeCurrentBill={onChangeCurrentBill}/>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
      </Accordion>
      <br />
    </>
  );
};

const BillCard = ({onChangeCurrentBill, onChangeAuthUser}) => {
  //Only show card once the state has updated and if a current bill exists
  if(!onChangeCurrentBill || !onChangeAuthUser) return <></>;

  const billMembers = onChangeCurrentBill.group_members;
  const dueDate = onChangeCurrentBill.due_date;

  let amountDue = null;
  let paidStatus = false;

  for(let item in billMembers) {
    if(billMembers[item].uid === onChangeAuthUser.uid) {
      amountDue = billMembers[item].amount_owed;
      paidStatus = billMembers[item].paid_status;
    }
  }
  
  return (
    <>
      <Card bg="light"  text="dark">
        <Card.Header >
            Current Bill
        </Card.Header>
        <Card.Body>
          <Card.Title>Due: {dueDate.toDate().toLocaleDateString()}</Card.Title>
          <Card.Text>
            Amount: ${amountDue}
          </Card.Text>
          {paidStatus ? <Paid /> : <NotPaid />}
        </Card.Body>
      </Card>
      <br />
    </>
  );
};
const Pie = () => {
	return (
		<>
      <Card className = "bg-light" text="light" >
        <Card.Title className = "bg-dark" text="light">
          On Time History
        </Card.Title>
        <Card.Body>
          <PieChart/>
        </Card.Body>
      </Card>
      <br />  
		</>
	);
};

const NotPaid = () => {
  return(
    <Alert variant="danger">
      Not Paid
    </Alert>
  );
};

const Paid = () => {
  return(
    <Alert variant="success">
      Paid
    </Alert>
  );
};

const MemberTable = ({onChangeCurrentBill}) => {
  const billMembers = onChangeCurrentBill.group_members;

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Room #</th>
          <th>Username</th>
          <th>Rent Amount $</th>
          <th>Payment Status</th>
        </tr>
      </thead>
      {billMembers && <tbody>{billMembers.map((item, key) => (
        <tr key={key}>
          <td>{key + 1}</td>
          <td>{item.username}</td>
          <td>{item.amount_owed}</td>
          <td>{item.paid_status ? <Paid /> : <NotPaid />}</td>
        </tr>
      ))
      }</tbody>}
    </Table>
  );
};

const Dashboard = compose(
  withFirebase,
  withAuthUserContext
)(DashboardBase);

export default Dashboard;
