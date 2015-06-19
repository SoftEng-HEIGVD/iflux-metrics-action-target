# iflux-metrics-action-target
An action target that provides a simple analytics service (aggregates)

## Development setup

Create a `.env` file in the root directory of the project and put the following content:

```bash
METRICS_ACTION_TYPE=http://localhost:3000/schemas/actionTypes/updateMetric

#####################################################################################################
# ONLY USED IN MODE WHERE IFLUX IS LOCALLY DEPLOYED AND MONGODB IS USED WITH DOCKER
#####################################################################################################
# MongoDB
MONGODB_HOST=<Boot2Docker IP>
MONGODB_PORT=27017
```

### Mandatory

| Name                       | Description                               |
| -------------------------- | ----------------------------------------- |
| METRICS_ACTION_TYPE        | Define the metrics action type. Must be unique. | 

### Optional

If you are using `Docker` you may have to configure this `MongoDB` info. Otherwise, it is supposed to
have a local installation of `MongoDB` automatically configured to `localhost:27017`

| Name                       | Description                               |
| -------------------------- | ----------------------------------------- |
| MONGODB_HOST               | Should be the Docker host IP (boot2docker IP, Vagrant VM IP, ...) |
| MONGODB_PORT               | Default port is 27017. |
