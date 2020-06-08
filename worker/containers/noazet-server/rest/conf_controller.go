package rest

import (
	"net/http"

	"github.com/Noazet-crypto/cluster/worker/containers/noazet-server/service"
	"github.com/gin-gonic/gin"
)

// GET /configs
func GetConfigs(ctx *gin.Context) {
	configs, err := service.GetConfigs()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, newMessageVo(err))
		return
	}
	m := map[string]string{}
	for _, config := range configs {
		m[config.Key] = config.Value
	}
	ctx.JSON(http.StatusOK, m)
}
