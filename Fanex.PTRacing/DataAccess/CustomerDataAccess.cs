namespace Fanex.PTRacing.DataAccess
{
    using System.Collections;
    using System.Data;
    using Fanex.Data;
    using Fanex.PTRacing.BusinessObjects;

    public class CustomerDataAccess : DataAccessBase, ICustomerDataAccess
    {
        #region Get Customer Information - Settings

        /// <summary>
        /// Get Customer For Edit Super
        /// </summary>
        /// <param name="context">The context of Add new Super</param>
        /// <returns>Return a ICustomer contains value default of Super</returns>
        public ICustomer Acc_CustomerSelHRSuper_All(IRequestContext requestContext)
        {
            IDataReader reader;
            ICustomer customer = new Customer();
            using (ObjectDb db = new ObjectDb("Acc_CustomerSelHRSuper_All", 120))
            {
                db.AssignParamValues(
                    new Hashtable() {
                        { "custid", requestContext.TargetCustId }
                    });
                reader = db.ExecuteReader();
                reader.Read();
                customer.ReadFromDataRecord(requestContext, reader);
            }

            return customer;
        }

        public ICustomer Acc_CustomerSelHRMaster_All(IRequestContext requestContext)
        {
            IDataReader reader;
            ICustomer customer = new Customer();
            using (ObjectDb db = new ObjectDb("Acc_CustomerSelHRMaster_All", 120))
            {
                db.AssignParamValues(
                    new Hashtable() {
                        { "custid", requestContext.TargetCustId }
                    });
                reader = db.ExecuteReader();
                reader.Read();
                customer.ReadFromDataRecord(requestContext, reader);
            }

            return customer;
        }

        public ICustomer Acc_CustomerSelHRAgent_SAg(IRequestContext requestContext)
        {
            IDataReader reader;
            ICustomer customer = new Customer();
            using (ObjectDb db = new ObjectDb("Acc_CustomerSelHRAgent_SAg", 120))
            {
                db.AssignParamValues(
                    new Hashtable() {
                        { "custid", requestContext.TargetCustId }
                    });
                reader = db.ExecuteReader();
                reader.Read();
                customer.ReadFromDataRecord(requestContext, reader);
            }

            return customer;
        }

        public ICustomer Acc_CustomerSelHRAgent_All(IRequestContext requestContext)
        {
            IDataReader reader;
            ICustomer customer = new Customer();
            using (ObjectDb db = new ObjectDb("Acc_CustomerSelHRAgent_All", 120))
            {
                db.AssignParamValues(
                    new Hashtable() {
                        { "custid", requestContext.TargetCustId }
                    });
                reader = db.ExecuteReader();
                reader.Read();
                customer.ReadFromDataRecord(requestContext, reader);
            }

            return customer;
        }

        public ICustomer Acc_CustomerSelHRMember_All(IRequestContext requestContext)
        {
            IDataReader reader;
            ICustomer customer = new Customer();
            using (ObjectDb db = new ObjectDb("Acc_CustomerSelHRMember_All", 120))
            {
                db.AssignParamValues(
                    new Hashtable() {
                        { "custid", requestContext.TargetCustId }
                    });
                reader = db.ExecuteReader();
                reader.Read();
                customer.ReadFromDataRecord(requestContext, reader);
            }

            return customer;
        }

        public ICustomer Acc_CustomerSelHREditMember_SAg(IRequestContext requestContext)
        {
            IDataReader reader;
            ICustomer customer = new Customer();
            using (ObjectDb db = new ObjectDb("Acc_CustomerSelHREditMember_SAg", 120))
            {
                db.AssignParamValues(
                    new Hashtable() {
                        { "custid", requestContext.TargetCustId }
                    });
                reader = db.ExecuteReader();
                reader.Read();
                customer.ReadFromDataRecord(requestContext, reader);
            }

            return customer;
        }

        public ICustomer Acc_CustomerSelHREditMember_MAg(IRequestContext requestContext)
        {
            IDataReader reader;
            ICustomer customer = new Customer();
            using (ObjectDb db = new ObjectDb("Acc_CustomerSelHREditMember_MAg", 120))
            {
                db.AssignParamValues(
                    new Hashtable() {
                        { "custid", requestContext.TargetCustId }
                    });
                reader = db.ExecuteReader();
                reader.Read();
                customer.ReadFromDataRecord(requestContext, reader);
            }

            return customer;
        }

        #endregion Get Customer Information - Settings

        #region Update customer's pt settings

        public Result Acc_CustomerUpdSuperHR_All(Hashtable parameters)
        {
            using (ObjectDb db = new ObjectDb("Acc_CustomerUpdSuperHR_All", 120))
            {
                db.AssignParamValues(parameters);
                db.ExecuteNonQuery();
                return this.GetResultParams(db.Database, db.DbCommand);
            }
        }

        public Result Acc_CustomerUpdMasterHR_All(Hashtable parameters)
        {
            using (ObjectDb db = new ObjectDb("Acc_CustomerUpdMasterHR_All", 120))
            {
                db.AssignParamValues(parameters);
                db.ExecuteNonQuery();
                return this.GetResultParams(db.Database, db.DbCommand);
            }
        }

        public Result Acc_CustomerUpdAgentHR_All(Hashtable parameters)
        {
            using (ObjectDb db = new ObjectDb("Acc_CustomerUpdAgentHR_All", 120))
            {
                db.AssignParamValues(parameters);
                db.ExecuteNonQuery();
                return this.GetResultParams(db.Database, db.DbCommand);
            }
        }

        public Result Acc_CustomerUpdMemberHR_All(Hashtable parameters)
        {
            using (ObjectDb db = new ObjectDb("Acc_CustomerUpdMemberHR_All", 120))
            {
                db.AssignParamValues(parameters);
                db.ExecuteNonQuery();
                return this.GetResultParams(db.Database, db.DbCommand);
            }
        }

        public Result Acc_CustomerUpdMemberHR_SAg(Hashtable parameters)
        {
            using (ObjectDb db = new ObjectDb("Acc_CustomerUpdMemberHR_SAg", 120))
            {
                db.AssignParamValues(parameters);
                db.ExecuteNonQuery();
                return this.GetResultParams(db.Database, db.DbCommand);
            }
        }

        public Result Acc_CustomerUpdMemberHR_MAg(Hashtable parameters)
        {
            using (ObjectDb db = new ObjectDb("Acc_CustomerUpdMemberHR_MAg", 120))
            {
                db.AssignParamValues(parameters);
                db.ExecuteNonQuery();
                return this.GetResultParams(db.Database, db.DbCommand);
            }
        }

        #endregion Update customer's pt settings
    }
}