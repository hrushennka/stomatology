import { 
  VisitModel as tblvisit, 
  PatientModel as tblpatient, 
  ProvidedServiceModel as tblprovidedservice, 
  ServiceModel as tblservice, 
  EmployeeModel as tblemployee, 
  OrgContractModel as tblorgcontract, 
  PaymentModel as tblpayment,
  OrganizationModel as tblorganization 
} from "../config/models.js";


const getPaymentsList = async (req, res) => {
  try {
    const visits = await tblvisit.findAll({
      include: [
        {
          model: tblprovidedservice,
          include: [tblservice],
          required: true,
        },
        {
          model: tblpatient,
          required: true,
        },
        {
          model: tblpayment,
          as: 'payments', 
          required: false, 
        },
      ],
    });

    const data = await Promise.all(
      visits.map(async (visit) => {
        const patient = visit.tblpatient;

        if (!patient) {
          console.error('Patient not found for visit:', visit.visitid);
          return null;
        }

        if (!visit.tblprovidedservices) {
          console.error('No services found for visit:', visit.visitid);
          return null;
        }

        const totalAmount = visit.tblprovidedservices.reduce(
          (sum, ps) => {
            if (ps.tblservice) {
              return sum + parseFloat(ps.tblservice.servicecost); 
            }
            return sum;
          }, 0
        );

        const employee = await tblemployee.findOne({
          where: { patientid: patient.patientid },
          include: [{ 
            model: tblorganization,
            attributes: ['organizationname'] 
          }]
        });

        const contractType = employee ? 'организация' : 'частный';

        let orgContract = null;
        if (employee) {
          orgContract = await tblorgcontract.findOne({
            where: { organizationid: employee.organizationid } 
          });
        }
        
        const isPaid = visit.payments && visit.payments.length > 0;

        return {
          VisitID: visit.visitid,
          PatientName: `${patient.patientlastname} ${patient.patientfirstname} ${patient.patientpatronymic || ''}`.trim(),
          VisitDate: visit.visitdate,
          VisitTime: visit.visittime,
          TotalAmount: totalAmount.toFixed(2),
          ContractType: contractType,
          OrgContractAmount: orgContract ? parseFloat(orgContract.orgcontractamount) : null, 
          OrgContractID: orgContract ? orgContract.orgcontractid : null, 
          OrganizationID: employee ? employee.organizationid : null, 
          OrganizationName: employee?.tblorganization?.organizationname || null, 
          IsPaid: isPaid, 
          tblprovidedservices: visit.tblprovidedservices
        };
      })
    );

    res.json(data.filter(item => item !== null));
  } catch (err) {
    console.error('Error in getPaymentsList:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const payVisit = async (req, res) => {
  try {
    const { VisitID } = req.params;

    // Проверяем, не оплачен ли уже визит
    const existingPayment = await tblpayment.findOne({
      where: { visitid: VisitID }
    });

    if (existingPayment) {
      return res.status(400).json({ 
        error: 'Этот визит уже оплачен',
        paidAmount: parseFloat(existingPayment.paymenttotalamount)
      });
    }

    const visit = await tblvisit.findByPk(VisitID, {
      include: [
        {
          model: tblprovidedservice,
          include: [tblservice],
          required: true,
        },
        {
          model: tblpatient,
        },
      ],
    });

    if (!visit) return res.status(404).json({ error: 'Visit not found' });

    const totalAmount = visit.tblprovidedservices.reduce(
      (sum, ps) => sum + parseFloat(ps.tblservice.servicecost), 0
    );

    const employee = await tblemployee.findOne({
      where: { patientid: visit.patientid }
    });

    if (employee) {
      const orgContract = await tblorgcontract.findOne({
        where: { organizationid: employee.organizationid }
      });

      if (!orgContract) {
        return res.status(400).json({ error: 'Org contract not found' });
      }

      let remainingAmount = parseFloat(orgContract.orgcontractamount);
      let amountFromContract = 0;
      let amountLeftToPay = 0;

      if (remainingAmount >= totalAmount) {
        amountFromContract = totalAmount;
        amountLeftToPay = 0;
      } else {
        amountFromContract = remainingAmount;
        amountLeftToPay = totalAmount - remainingAmount;
      }

      await orgContract.update({ 
        orgcontractamount: remainingAmount - amountFromContract 
      });

      await tblpayment.create({
        visitid: VisitID,
        paymenttotalamount: totalAmount,
      });

     if (amountLeftToPay > 0) {
  return res.json({
    message: `Оплачено ${amountFromContract.toFixed(2)} с договора организации. Осталось доплатить ${amountLeftToPay.toFixed(2)}`,
    paidAmount: totalAmount,
    paidFromContract: amountFromContract,
    paidByClient: amountLeftToPay,
    isPaid: true,
  });
} else {
  return res.json({ 
    message: 'Оплата прошла успешно', 
    paidAmount: totalAmount,
    paidFromContract: totalAmount,
    paidByClient: 0,
    isPaid: true
  });
}

    } else {
      await tblpayment.create({
        visitid: VisitID,
        paymenttotalamount: totalAmount,
      });

      return res.json({ 
  message: 'Оплата прошла успешно', 
  paidAmount: totalAmount,
  paidFromContract: 0,
  paidByClient: totalAmount,
  isPaid: true
});
    }
  } catch (err) {
    console.error('Error in payVisit:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      details: err.message
    });
  }
};

export default {
  getPaymentsList,
  payVisit,
};
