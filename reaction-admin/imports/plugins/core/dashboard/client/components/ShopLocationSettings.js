import React, { Fragment, useState } from "react";
import i18next from "i18next";
import SimpleSchema from "simpl-schema";
import gql from "graphql-tag";
import { Button, TextField } from "@reactioncommerce/catalyst";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import muiOptions from "reacto-form/cjs/muiOptions";
import useCurrentShop from "/imports/client/ui/hooks/useCurrentShop.js";
import { useMutation } from "@apollo/react-hooks";
import { useSnackbar } from "notistack";

import {
    Box,
    Card,
    CardHeader,
    CardActions,
    CardContent,
    CircularProgress,
    makeStyles,
    Grid
  } from "@material-ui/core";

  const useStyles = makeStyles((theme) => ({
    cardActions: {
      padding: theme.spacing(2),
      justifyContent: "flex-end"
    }
  }));

  const shopLocationSchema = new SimpleSchema({
    location: {
      type: Object
    },
    "location.coordinates": {
      type: Array,
      minCount: 2,
      maxCount: 2,
    },
    "location.coordinates": [Number],
  });

  const updateShopMutation = gql`
  mutation updateShopMutation($input: UpdateShopInput!) {
    updateShop(input: $input) {
      clientMutationId
      shop {
        _id
        location {
          coordinates
        }
      }
    }
  }
`;

  const validator = shopLocationSchema.getFormValidator();

const ShopLocationSettings = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isLoading, shop, shopId, refetchShop } = useCurrentShop();
    const [updateShop] = useMutation(updateShopMutation);
    const { enqueueSnackbar } = useSnackbar();

    const handleUpdateLocation = async (formData) => {
        const { location } = formData;
        try {
            await updateShop({
              variables: {
                input: {
                  shopId,
                  location
                }
              }
            });
            enqueueSnackbar(i18next.t("admin.settings.saveSuccess"), { variant: "success" });
        } catch (error) {
            enqueueSnackbar(i18next.t("admin.settings.saveFailed"), { variant: "error" });
        }
    };

    const {
        getFirstErrorMessage,
        getInputProps,
        hasErrors,
        isDirty,
        submitForm
      } = useReactoForm({
        async onSubmit(formData) {
            setIsSubmitting(true);
            await handleUpdateLocation(shopLocationSchema.clean(formData));
            setIsSubmitting(false);
          },
          validator(formData) {
            return validator(shopLocationSchema.clean(formData));
          },
          value: shop
      });

      const classes = useStyles();

      const handleSubmitForm = (event) => {
        event.preventDefault();
        submitForm();
      };

    if (!shop || isLoading) {
        return (
          <Box textAlign="center">
            <CircularProgress variant="indeterminate" color="primary" />
          </Box>
        );
    }

    return (<Card>
        <CardHeader
            subheader="Set the shop location by latitude and Longitude"
            title="Shop Location"
        />
        <CardContent>
        <Grid container spacing={2}>
        <Grid item xs={6}>
            <TextField
              error={hasErrors(["location.coordinates.1"])}
              helperText={getFirstErrorMessage(["location.coordinates.1"])}
              label="Latitude"
              placeholder="Enter the Latitude"
              {...getInputProps("location.coordinates.1", muiOptions)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              error={hasErrors(["location.coordinates.0"])}
              helperText={getFirstErrorMessage(["location.coordinates.0"])}
              label="Longitude"
              placeholder={i18next.t("shopSettings.shopLogo.primaryShopLogoUrlDescription")}
              {...getInputProps("location.coordinates.0", muiOptions)}
            />
          </Grid>
            </Grid>
        </CardContent>
        <CardActions className={classes.cardActions}>
        <Button
          color="primary"
          disabled={isSubmitting || !isDirty}
          variant="contained"
          onClick={handleSubmitForm}
        >
          {i18next.t("app.saveChanges")}
        </Button>
      </CardActions>
    </Card>)
}

export default ShopLocationSettings;
