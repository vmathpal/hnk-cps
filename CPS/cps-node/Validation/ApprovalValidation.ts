import db from "../models";
import { Op } from "sequelize";
import { returnResponse } from "../helper/helper";

export const statusValidation = async (req: any, res: any, next: any) => {
  var responseData = {} as any;
  const check = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: req.body.projectID,
      userID: req.body.userID,
    },
  });
  console.log(check.type);
  if (check.status !== "pending") {
    responseData.message = "You have already taken action.";
    responseData.success = false;
    responseData.data = {};
    return res.status(422).json(responseData);
  }
  if (check.type == "level3") {
    const checkLevel4 = await db.DirectorAndReviewerApprover.findOne({
      where: {
        projectID: req.body.projectID,
        type: "level4",
      },
    });

    const costCenter = await db.DirectorAndReviewerApprover.findOne({
      where: {
        projectID: req.body.projectID,
        type: "cost_center",
        status: "pending",
      },
    });

    if (checkLevel4) {
      const Level4 = await db.DirectorAndReviewerApprover.findOne({
        where: {
          projectID: req.body.projectID,
          type: "level4",
          status: "approved",
        },
      });
      if (!Level4) {
        responseData.message = "Approval pending from lower level user";
        responseData.success = false;
        responseData.data = {};

        return res.status(422).json(responseData);
      }
    } else if (costCenter) {
      responseData.message = "Cost Center will approve first";
      responseData.success = false;
      responseData.data = {};

      return res.status(422).json(responseData);
    }
    return next();
  }

  if (check.type == "level4") {
    const checkLevel5 = await db.DirectorAndReviewerApprover.findOne({
      where: {
        projectID: req.body.projectID,
        type: "level5",
      },
    });

    const costCenter = await db.DirectorAndReviewerApprover.findOne({
      where: {
        projectID: req.body.projectID,
        type: "cost_center",
        status: "pending",
      },
    });

    if (checkLevel5) {
      const Level5 = await db.DirectorAndReviewerApprover.findOne({
        where: {
          projectID: req.body.projectID,
          type: "level5",
          status: "approved",
        },
      });
      if (!Level5) {
        responseData.message = "Approval pending from lower level user";
        responseData.success = false;
        responseData.data = {};

        return res.status(422).json(responseData);
      }
    } else if (costCenter) {
      responseData.message = "Cost Center will approve first";
      responseData.success = false;
      responseData.data = {};

      return res.status(422).json(responseData);
    }
    return next();
  }

  if (check.type == "level5") {
    const costCenter = await db.DirectorAndReviewerApprover.findOne({
      where: {
        projectID: req.body.projectID,
        type: "cost_center",
        status: "pending",
      },
    });

    if (costCenter) {
      responseData.message = "Cost Center will approve first";
      responseData.success = false;
      responseData.data = {};

      return res.status(422).json(responseData);
    }
    return next();
  }

  if (check.type == "cost_center") {
    const checkReviewer = await db.DirectorAndReviewerApprover.findOne({
      where: {
        projectID: req.body.projectID,
        type: "reviewer",
      },
    });
    const ba = await db.DirectorAndReviewerApprover.findOne({
      where: {
        projectID: req.body.projectID,
        type: "ba",
        status: "pending",
      },
    });
    if (checkReviewer) {
      const reviewer = await db.DirectorAndReviewerApprover.findOne({
        where: {
          projectID: req.body.projectID,
          type: "reviewer",
          status: "approved",
        },
      });
      if (!reviewer) {
        responseData.message = "Reviewer will approve first";
        responseData.success = false;
        responseData.data = {};

        return res.status(422).json(responseData);
      }
    } else if (ba) {
      responseData.message = "Business Analyst will approve first";
      responseData.success = false;
      responseData.data = {};

      return res.status(422).json(responseData);
    }
    return next();
  }

  if (check.type == "reviewer") {
    const ba = await db.DirectorAndReviewerApprover.findOne({
      where: {
        projectID: req.body.projectID,
        type: "ba",
        status: "pending",
      },
    });
    if (ba) {
      responseData.message = "Business Analyst will approve first";
      responseData.success = false;
      responseData.data = {};

      return res.status(422).json(responseData);
    }
    return next();
  }
  var project = await db.Project.findByPk(req.body.projectID);
  if (project.totalBudget > 25000) {
    if (check.type == "director") {
      const checklevel3 = await db.DirectorAndReviewerApprover.findOne({
        where: {
          projectID: req.body.projectID,
          type: "level3",
        },
      });

      const costCenter = await db.DirectorAndReviewerApprover.findOne({
        where: {
          projectID: req.body.projectID,
          type: "cost_center",
          status: "pending",
        },
      });

      if (checklevel3) {
        const level3 = await db.DirectorAndReviewerApprover.findOne({
          where: {
            projectID: req.body.projectID,
            type: "level3",
            status: "approved",
          },
        });
        if (!level3) {
          responseData.message = "Approval pending from lower level user";
          responseData.success = false;
          responseData.data = {};

          return res.status(422).json(responseData);
        }
      } else if (costCenter) {
        responseData.message = "Cost Center will approve first";
        responseData.success = false;
        responseData.data = {};

        return res.status(422).json(responseData);
      }
      return next();
    }
    if (project.totalBudget > 250000) {
      if (check.type == "genral_maneger") {
        const director = await db.DirectorAndReviewerApprover.findOne({
          where: {
            projectID: req.body.projectID,
            type: "director",
            status: "pending",
          },
        });
        if (director) {
          responseData.message = "director will approve first";
          responseData.success = false;
          responseData.data = {};

          return res.status(422).json(responseData);
        }
        return next();
      }
    }
  } else {
    if (check.type == "commercial_controller") {
      const checklevel3 = await db.DirectorAndReviewerApprover.findOne({
        where: {
          projectID: req.body.projectID,
          type: "level3",
        },
      });

      const costCenter = await db.DirectorAndReviewerApprover.findOne({
        where: {
          projectID: req.body.projectID,
          type: "cost_center",
          status: "pending",
        },
      });

      if (checklevel3) {
        const level3 = await db.DirectorAndReviewerApprover.findOne({
          where: {
            projectID: req.body.projectID,
            type: "level3",
            status: "approved",
          },
        });
        if (!level3) {
          responseData.message = "Approval pending from lower level user";
          responseData.success = false;
          responseData.data = {};

          return res.status(422).json(responseData);
        }
      } else if (costCenter) {
        responseData.message = "Cost Center will approve first";
        responseData.success = false;
        responseData.data = {};

        return res.status(422).json(responseData);
      }
      return next();
    }
  }

  return next();
};
